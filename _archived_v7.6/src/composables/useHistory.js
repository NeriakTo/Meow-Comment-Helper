import { computed } from 'vue';

export function useHistory(currentStudent) {

    const pushToHistory = (newComment) => {
        if (!currentStudent.value) return;
        const student = currentStudent.value;

        // Init if missing
        if (!student.comment_history) student.comment_history = [];
        if (student.history_index === undefined) student.history_index = -1;

        // Skip if identical
        if (student.comment_history.length > 0 &&
            student.comment_history[student.history_index] === newComment) {
            return;
        }

        // Truncate future
        if (student.history_index < student.comment_history.length - 1) {
            student.comment_history = student.comment_history.slice(0, student.history_index + 1);
        }

        student.comment_history.push(newComment);

        // Limit size
        if (student.comment_history.length > 15) {
            student.comment_history.shift();
        }

        student.history_index = student.comment_history.length - 1;

        // Sync
        student.polished_comment = newComment;
    };

    const undo = () => {
        if (!currentStudent.value || !currentStudent.value.comment_history) return;
        const student = currentStudent.value;
        if (student.history_index <= 0) return;

        student.history_index--;
        student.polished_comment = student.comment_history[student.history_index];
    };

    const redo = () => {
        if (!currentStudent.value || !currentStudent.value.comment_history) return;
        const student = currentStudent.value;
        if (student.history_index >= student.comment_history.length - 1) return;

        student.history_index++;
        student.polished_comment = student.comment_history[student.history_index];
    };

    // Computed for UI state
    const canUndo = computed(() => currentStudent.value && currentStudent.value.history_index > 0);
    const canRedo = computed(() => currentStudent.value && currentStudent.value.comment_history && currentStudent.value.history_index < currentStudent.value.comment_history.length - 1);

    return {
        pushToHistory,
        undo,
        redo,
        canUndo,
        canRedo
    };
}
