import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { AwsS3Service } from './services/aws-s3.service';

const providers = [ApiConfigService, AwsS3Service];

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
