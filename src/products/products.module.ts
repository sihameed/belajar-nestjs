import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from 'src/products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product])], 
    controllers: [ProductsController], 
    providers: [ProductService]
})
export class ProductsModule {}
