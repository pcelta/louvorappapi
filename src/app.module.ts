import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LouvorappModule } from './louvorapp/louvorapp.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LouvorappModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
