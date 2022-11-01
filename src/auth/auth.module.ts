import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import{ JwtModule} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './guards/jwt.guards';
// import { JwtStrategy } from './jwt-strategy';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports:[

    forwardRef(() => UserModule),
    // JwtModule.registerAsync({
     
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async(configService: ConfigService) => ({
    //     secret:configService.get ('JWT_SECRET'),
    //     signOptions:{expiresIn: '100s'}
    //   })
    // }),
    JwtModule.register({
      // secret: jwtConstants.secret,
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService,  JwtStrategy, JwtAuthGuard ],
  exports: [AuthService]
})
export class AuthModule {}
 