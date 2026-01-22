import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { ConfigModule } from './nest-modules/config-module/config.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
