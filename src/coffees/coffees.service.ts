import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffee) private readonly coffeeRepository: Repository<Coffee>,

    @InjectRepository(Flavor) private readonly flavorRepository: Repository<Flavor>,
  
  
  ){}



  async create(createCoffeeDto: CreateCoffeeDto) {
const flavors  = await Promise.all (
  createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
);
const coffee = this.coffeeRepository.create(flavors);
return this.coffeeRepository.save(coffee)

 
  }

  findAll() {
    return this.coffeeRepository.find({
      relations: ['flavors']
    });
  }

  async findOne(id: number) {
   const coffee =  await this.coffeeRepository.findOne({relations: ['flavors']});

   if(!coffee){
    throw new HttpException("not found",HttpStatus.NOT_FOUND)
   }
   return coffee;
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors = updateCoffeeDto.flavors && (await Promise.all(
      updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
    ));
     const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto, 
   
     });
    if(!coffee){
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    }
    return this.coffeeRepository.save(coffee)

  }

  async remove(id: number) {
    const coffee =  await this.coffeeRepository.findOneBy({id})
    return this.coffeeRepository.remove(coffee)
  }

  private async preloadFlavorByName(name:string): Promise<Flavor>{
    const existingFlavor = await this.flavorRepository.findOneBy({name});
    if(existingFlavor){
      return existingFlavor;

    }
    return this.flavorRepository.create({name})
  }
}
