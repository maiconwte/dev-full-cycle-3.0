import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { CastMembersModule } from './nest-modules/cast-members-module/cast-members.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { GenresModule } from './nest-modules/genres-module/genres.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    CastMembersModule,
    GenresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
