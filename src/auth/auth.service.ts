import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { WaiterEntity } from '../waiters/waiter.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(WaiterEntity)
    private waiterRepo: Repository<WaiterEntity>,
  ) {}

  async login(username: string, password: string) {
    const waiter = await this.waiterRepo.findOne({ where: { username } });
    if (!waiter || !(await bcrypt.compare(password, waiter.password))) {
      throw new UnauthorizedException();
    }

    return {
      access_token: this.jwtService.sign({ sub: waiter.id }),
    };
  }
}
