import { AuthGuard } from '@nestjs/passport';

class JwtAuthGuard extends AuthGuard('jwt') {}

export { JwtAuthGuard }