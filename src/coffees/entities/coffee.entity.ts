
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity()
export class Coffee {
@PrimaryGeneratedColumn()
id: number; 

@Column()
name: string;

@Column()
brand: string;

 // this specify the owner side of the relationship.
//   @ManyToMany(type => Flavor, flavor => flavor.coffees, {
//     cascade: true, //['insert]
//   })
//  @JoinTable() 
//   flavors: Flavor[];


}
  