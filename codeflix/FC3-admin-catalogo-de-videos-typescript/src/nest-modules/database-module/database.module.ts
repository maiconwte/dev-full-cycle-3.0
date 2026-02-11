import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { ConfigService } from '@nestjs/config';
import { CONFIG_SCHEMA_TYPE } from 'src/nest-modules/config-module/config.module';

const models = [
  CategoryModel,
  CastMemberModel,
  // GenreModel,
  // GenreCategoryModel,
  // VideoModel,
  // VideoCategoryModel,
  // VideoCastMemberModel,
  // VideoGenreModel,
  // ImageMediaModel,
  // AudioVideoMediaModel,
];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        const dbVendor = configService.get('DB_VENDOR');
        if (dbVendor === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: configService.get('DB_HOST'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          };
        }

        if (dbVendor === 'mysql') {
          return {
            dialect: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            database: configService.get('DB_DATABASE'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          };
        }

        throw new Error(`Unsupported database configuration: ${dbVendor}`);
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
