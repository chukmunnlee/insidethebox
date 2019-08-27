import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TvModule } from './tv/tv.module';
import { AdminModule } from './admin/admin.module';
import { AngularModule } from './angular/angular.module';

@Module({
    imports: [ TvModule, AdminModule,
        AngularModule.forRoot({ rootPath: '../frontend/dist/frontend', renderPath: '/' }) 
    ],
    controllers: [AppController ],
    providers: [ ],
})

export class AppModule {}
