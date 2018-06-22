import { VrgalMainModule } from './vrgal-main.module';

describe('VrgalMainModule', () => {
  let vrgalMainModule: VrgalMainModule;

  beforeEach(() => {
    vrgalMainModule = new VrgalMainModule();
  });

  it('should create an instance', () => {
    expect(vrgalMainModule).toBeTruthy();
  });
});
