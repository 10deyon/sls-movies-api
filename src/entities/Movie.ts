import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';

@Entity({ name: 'movies' })
class Movie {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    producer: string;

    @Column({ nullable: false })
    release_date: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toPayload(): Partial<Movie> {
        return {
            id: this.id,
            title: this.title,
            producer: this.producer,
            release_date: this.release_date,
            createdAt: this.createdAt,
        };
    }
}

export default Movie;
