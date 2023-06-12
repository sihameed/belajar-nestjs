import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from 'src/products/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Kemasan } from './entities/kemasan.entity';
import { PRODUCT_BRANDS } from './products.constants';

class MockProductsService {

}


@Module({
    imports: [TypeOrmModule.forFeature([Product, Kemasan, Event])], 
    controllers: [ProductsController], 
    providers: [ProductService, 
        {
        provide: PRODUCT_BRANDS,
        useValue: ['kf', 'sanbe', 'kalbe']
    }], 
    exports: [ProductService],
})
export class ProductsModule {}
