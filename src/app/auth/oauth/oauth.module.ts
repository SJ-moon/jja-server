import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { AuthModule } from '@app/auth/auth.module';
import { OAuthGoogleService } from '@app/auth/oauth/services/oauth.google.service';
import { OAuthGoogleAdapter } from './adapters/oauth.google.adapter';

@Module({
  imports: [forwardRef(() => AuthModule), HttpModule],
  exports: [OAuthGoogleService],
  controllers: [],
  providers: [OAuthGoogleService, OAuthGoogleAdapter],
})
export class OAuthModule {}
