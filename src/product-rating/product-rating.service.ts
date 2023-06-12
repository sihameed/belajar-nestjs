import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/products/products.service';

@Injectable()
export class ProductRatingService {
    constructor(private readonly productService: ProductService) {}
}
