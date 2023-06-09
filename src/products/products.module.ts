import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from 'src/products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Kemasan } from './entities/kemasan.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Kemasan])], 
    controllers: [ProductsController], 
    providers: [ProductService]
})
export class ProductsModule {}
