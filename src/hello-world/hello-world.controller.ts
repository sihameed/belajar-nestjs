import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('hello-world')
export class HelloWorldController {
    @Get(':id')
    helloLang(@Param('id') id: string) {
        return `Halo #${id}, apa kbr ente?`;
    }

    @Post()
    helloPost(@Body('name') body) {
        return body;
    }
}
