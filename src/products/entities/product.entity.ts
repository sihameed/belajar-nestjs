import { type } from "os";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Kemasan } from "./kemasan.entity";

@Entity('T_PRODUCT')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @JoinTable()
    @ManyToMany(
        type => Kemasan, 
        (kemasan) => kemasan.products,
        {
            cascade: true
        }
    )
    kemasans: Kemasan[];
}