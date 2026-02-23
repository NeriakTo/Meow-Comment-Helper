import { ref, reactive, computed, watch, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import { BEHAVIOR_CONFIG, BEHAVIOR_OPTIONS, DEFAULT_TAGS } from '../config/constants';

// Singleton State (Shared across components)
const db = reactive({
    activeClassId: 'default',
    classes: {},
    customTags: null
});

const currentIdx = ref(-1);
const searchQuery = ref('');
const selectedSubject = ref('一般導師');
const isSidebarOpen = ref(false); // UI State often coupled with selection

// Helper: Initialize Student with full structure
const initializeStudentData = (student) => {
    if (!student) return;

    // Behavior
    if (!student.behavior) student.behavior = {};
    Object.keys(BEHAVIOR_CONFIG).forEach(category => {
        if (!student.behavior[category]) {
            student.behavior[category] = {
                items: BEHAVIOR_CONFIG[category].items.map(() => ''),
                suggestion: ''
            };
        } else {
            if (!student.behavior[category].items || student.behavior[category].items.length !== BEHAVIOR_CONFIG[category].items.length) {
                student.behavior[category].items = BEHAVIOR_CONFIG[category].items.map(() => '');
            }
            if (student.behavior[category].suggestion === undefined) {
                student.behavior[category].suggestion = '';
            }
        }
    });

    // Records
    if (!student.records) {
        student.records = {
            groupActivity: '',
            publicServiceSchool: '',
            publicServiceCommunity: '',
            specialPerformanceSchool: '',
            specialPerformanceExternal: ''
        };
    } else {
        const r = student.records;
        if (r.groupActivity === undefined) r.groupActivity = '';
        if (r.publicServiceSchool === undefined) r.publicServiceSchool = '';
        if (r.publicServiceCommunity === undefined) r.publicServiceCommunity = '';
        if (r.specialPerformanceSchool === undefined) r.specialPerformanceSchool = '';
        if (r.specialPerformanceExternal === undefined) r.specialPerformanceExternal = '';
    }

    // Locks
    if (student.locked_comment === undefined) student.locked_comment = false;
    if (student.locked_motto === undefined) student.locked_motto = false;

    // History (V7.6)
    if (!student.comment_history) student.comment_history = [];
    if (student.polished_comment && student.comment_history.length === 0) {
        student.comment_history.push(student.polished_comment);
        student.history_index = 0;
    }
    if (student.history_index === undefined) student.history_index = student.comment_history.length - 1;

    return student;
};

// V7.4: Init behavior helper
const initStudentBehavior = () => {
    const behavior = {};
    const records = {
        groupActivity: '',
        publicServiceSchool: '',
        publicServiceCommunity: '',
        specialPerformanceSchool: '',
        specialPerformanceExternal: ''
    };
    Object.keys(BEHAVIOR_CONFIG).forEach(category => {
        behavior[category] = {
            items: BEHAVIOR_CONFIG[category].items.map(() => ''),
            suggestion: ''
        };
    });
    return { behavior, records };
};

export function useStudentDB() {

    // Computed props
    const currentClassData = computed(() => db.classes[db.activeClassId] || { name: '未知班級', students: [], grade: '', classNum: '' });
    const students = computed(() => currentClassData.value.students || []);

    const filteredStudents = computed(() => {
        const list = students.value || [];
        if (!searchQuery.value) return list.map((s, i) => ({ ...s, originalIndex: i }));
        return list.map((s, i) => ({ ...s, originalIndex: i }))
            .filter(s => s.id.includes(searchQuery.value) || s.name.includes(searchQuery.value));
    });

    const currentStudent = computed(() => {
        if (currentIdx.value === -1) return null;
        const student = students.value[currentIdx.value];
        if (student) initializeStudentData(student);
        return student;
    });

    const currentTags = computed(() => {
        if (db.customTags && db.customTags[selectedSubject.value]) {
            return db.customTags[selectedSubject.value];
        }
        return DEFAULT_TAGS[selectedSubject.value] || DEFAULT_TAGS['一般導師'];
    });

    // Actions
    const selectStudent = (index) => {
        currentIdx.value = index;
        isSidebarOpen.value = false;
    };

    const switchClass = (id) => {
        db.activeClassId = id;
        currentIdx.value = -1;
        isSidebarOpen.value = false;
    };

    const deleteClass = (id) => {
        if (Object.keys(db.classes).length <= 1) return;
        if (confirm('確定要刪除此班級嗎？此動作無法復原。')) {
            delete db.classes[id];
            if (db.activeClassId === id) {
                db.activeClassId = Object.keys(db.classes)[0];
                currentIdx.value = -1;
            }
        }
    };

    const createClass = (name, grade, classNum, count, alias = '') => {
        const newId = 'class_' + Date.now();
        const newStudents = Array.from({ length: count }, (_, i) => {
            const { behavior, records } = initStudentBehavior();
            const student = {
                id: String(i + 1).padStart(2, '0'), name: '', raw_comment: '', polished_comment: '', motto: '',
                behavior, records
            };
            initializeStudentData(student);
            return student;
        });
        db.classes[newId] = {
            name: name || (alias ? `${alias}` : `${grade}年${classNum}班`),
            grade: String(grade),
            classNum: String(classNum),
            alias: String(alias), // Store alias explicitly
            students: newStudents
        };
        switchClass(newId);
    };

    const handleImportExcel = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const wb = XLSX.read(evt.target.result, { type: 'binary' });
                    const ws = wb.Sheets[wb.SheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                    if (data.length < 3) throw new Error('檔案格式錯誤：資料不足');

                    const studentRows = data.slice(2);
                    let detectedGrade = '';
                    let detectedClassNum = '';

                    if (studentRows.length > 0) {
                        if (studentRows[0][0]) detectedGrade = String(studentRows[0][0]);
                        if (studentRows[0][1]) detectedClassNum = String(studentRows[0][1]);
                    }

                    const categories = ['敬愛人', '愛整潔', '守秩序', '有禮貌', '做環保'];
                    const categoryOffsets = [4, 10, 16, 22, 28];

                    const importedStudents = studentRows.map((row, rowIdx) => {
                        if (!row || row.length === 0) return null;

                        const { behavior, records } = initStudentBehavior();
                        const grade = row[0] ? String(row[0]) : '';
                        const classNum = row[1] ? String(row[1]) : '';
                        const id = row[2] ? String(Math.floor(parseFloat(row[2]))).padStart(2, '0') : String(rowIdx + 1).padStart(2, '0');
                        const name = row[3] ? String(row[3]) : '';

                        categories.forEach((category, catIdx) => {
                            const offset = categoryOffsets[catIdx];
                            for (let i = 0; i < 5; i++) {
                                if (row[offset + i]) behavior[category].items[i] = String(row[offset + i]);
                            }
                            if (row[offset + 5]) behavior[category].suggestion = String(row[offset + 5]);
                        });

                        // Records (offsets 34-38)
                        if (row[34]) records.groupActivity = String(row[34]);
                        if (row[35]) records.publicServiceSchool = String(row[35]);
                        if (row[36]) records.publicServiceCommunity = String(row[36]);
                        if (row[37]) records.specialPerformanceSchool = String(row[37]);
                        if (row[38]) records.specialPerformanceExternal = String(row[38]);

                        const polished_comment = row[39] ? String(row[39]) : '';
                        const motto = row[40] ? String(row[40]) : '';

                        const student = {
                            id, name, polished_comment, motto, raw_comment: '', behavior, records
                        };
                        initializeStudentData(student);
                        return student;
                    }).filter(s => s !== null);

                    const newId = 'class_import_' + Date.now();
                    let className = file.name.replace(/\.[^/.]+$/, "");
                    if (detectedGrade && detectedClassNum) {
                        className = `${detectedGrade}年${detectedClassNum}班 (匯入)`;
                    }
                    db.classes[newId] = { name: className, grade: detectedGrade, classNum: detectedClassNum, students: importedStudents };
                    switchClass(newId);
                    resolve({ grade: detectedGrade, classNum: detectedClassNum, count: importedStudents.length });
                } catch (e) {
                    reject(e);
                }
            };
            reader.readAsBinaryString(file);
        });
    };

    // Persistence
    // We only set up the loop once, logically.
    // In composable, it might be called multiple times.
    // Better to have init function.

    const initDB = () => {
        const savedDB = localStorage.getItem('gemini_comments_v4_db');
        if (savedDB) {
            try {
                const parsed = JSON.parse(savedDB);
                Object.keys(parsed.classes || {}).forEach(classId => {
                    if (parsed.classes[classId].students) {
                        parsed.classes[classId].students.forEach(initializeStudentData);
                    }
                });
                Object.assign(db, parsed);
                // Ensure active class exists
                if (!db.classes[db.activeClassId]) {
                    db.activeClassId = Object.keys(db.classes)[0] || 'default';
                }
            } catch (e) {
                console.error("DB Load Error", e);
            }
        }

        if (!db.customTags) {
            db.customTags = JSON.parse(JSON.stringify(DEFAULT_TAGS));
        }

        watch(db, (newVal) => {
            localStorage.setItem('gemini_comments_v4_db', JSON.stringify(newVal));
        }, { deep: true });
    };

    return {
        db,
        currentIdx,
        searchQuery,
        selectedSubject,
        isSidebarOpen,
        // Computed
        currentClassData,
        filteredStudents,
        currentStudent,
        currentTags,
        // Methods
        selectStudent,
        switchClass,
        deleteClass,
        createClass,
        handleImportExcel,
        initDB,
        initializeStudentData
    };
}
