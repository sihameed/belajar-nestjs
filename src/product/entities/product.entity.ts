import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('T_PRODUCT')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @Column('box', {nullable: false})
    packages: string[];
}