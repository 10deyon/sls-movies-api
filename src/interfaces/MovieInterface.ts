export interface BaseMovie {
    id?: number;
    title: string;
    producer: string;
    release_date: Date;
}

export interface CreateMovie extends BaseMovie {
    created_at?: Date;
}

export interface UpdateMovie extends BaseMovie {
    updated_at?: Date;
}
