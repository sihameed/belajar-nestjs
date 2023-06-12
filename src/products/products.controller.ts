import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from 'src/products/products.service';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    findAll(@Query() paginationQuery: PaginationQueryDto) {
        // const {limit, offset} = paginationQuery;

        return this.productService.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id') id:string) {
        return this.productService.findOne(id);
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        console.log(createProductDto instanceof CreateProductDto);

        return this.productService.create(createProductDto);
    }

    @Patch(':id')
    update(@Param('id') id:string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id:string) {
        return this.productService.remove(id);
    }
}
