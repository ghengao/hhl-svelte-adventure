type ElfTallyRecord = {
	name: string;
	tally: number;
};

type TaskType = 'CREATED_TOY' | 'WRAPPED_PRESENT'

interface Task {
	elf: string
	task: TaskType
	minutesTaken: number
    date: string;
}

export type { ElfTallyRecord, Task };
