import { Module } from "@nestjs/common";

import { TvService } from './tv.service';
import { TvController } from "./tv.controller";

import * as config from '../../../config.json';

@Module({
    controllers: [ TvController ],
    providers: [ TvService ]
})
export class TvModule { }