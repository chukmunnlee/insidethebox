import { Controller, Get, Header } from '@nestjs/common';

import { Health } from '../../../common/response';

@Controller('/admin')
export class AdminController {

    @Get('health')
    @Header('Content-Type', 'application/json')
    healthcheck(): Health {
        return (
            <Health>{
                status: 'OK',
                timestamp: (new Date()).toUTCString()
            }
        );
    }
}
