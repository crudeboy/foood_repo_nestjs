import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as sinon from 'sinon';
import { getModelToken } from '@nestjs/mongoose';
import { BcryptService } from './helpers/hashing.service';
import { OtpService } from 'src/auth/otp.service';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/notification/mail.service';

describe('user Service functionalities', () => {
    let userService: UsersService;
    let bcryptService: BcryptService;
    let otpService: OtpService;
    let authService: AuthService;
    let mailerService: MailService;
    let sandBox: sinon.sandBox;

    const mockUserrepository = {};
    const mockBcyptService = {};
    const mockOtpService = {};
    const mockAuthService = {};
    const mockMailService = {};
    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                BcryptService,
                OtpService,
                AuthService,
                MailService,
                {
                    provide: getModelToken('User'),
                    useValue: mockUserrepository,
                },
            ],
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .overrideProvider(BcryptService)
            .useValue(mockBcyptService)
            .overrideProvider(OtpService)
            .useValue(mockOtpService)
            .overrideProvider(MailService)
            .useValue(mockMailService)
            .compile();
        userService = moduleRef.get<UsersService>(UsersService);
    });

    it('Chould be defined', () => {
        expect(userService).toBeDefined();
    });
});
