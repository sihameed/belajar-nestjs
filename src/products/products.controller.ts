import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    findAll(@Query() paginationQuery) {
        // const {limit, offset} = paginationQuery;

        return this.productService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string) {
        return this.productService.findOne(id);
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto): void {
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
