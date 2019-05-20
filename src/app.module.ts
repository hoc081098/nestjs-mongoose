import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://hoc081098:hoc081098@ds157956.mlab.com:57956/test-nestjs',
      synchronize: true,
      useNewUrlParser: true,
      entities: [join(__dirname, '**/*.entity{.ts,.js}')],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
