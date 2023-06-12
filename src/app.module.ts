import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRatingModule } from './product-rating/product-rating.module';

@Module({
  imports: [ProductsModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    autoLoadEntities: true,
    synchronize: true
  }), ProductRatingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
