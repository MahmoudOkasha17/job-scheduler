import { appBootstrapLoader } from '@common';
import { AppModule } from './app.module';



appBootstrapLoader(AppModule, { swagger: { enabled: true, config: { version: '1.0.0' } } , appShortName: 'job-schedular' });
