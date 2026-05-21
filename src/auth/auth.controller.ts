import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ForgotPasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';

/**
 * This controller exists solely to expose better-auth routes in Swagger UI.
 * Actual request handling is done by better-auth middleware which intercepts
 * before NestJS routing — these methods are never executed.
 */
@ApiTags('auth')
@AllowAnonymous()
@Controller('auth')
export class AuthController {
  @Post('sign-in/email')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'Session cookie is set' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  signIn() {}

  @Post('sign-up/email')
  @ApiOperation({ summary: 'Register with email and password' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 200,
    description: 'Account created, session cookie is set',
  })
  @ApiResponse({ status: 422, description: 'Email already in use' })
  signUp() {}

  @Post('sign-out')
  @ApiOperation({ summary: 'Sign out and invalidate session' })
  @ApiResponse({ status: 200, description: 'Session invalidated' })
  signOut() {}

  @Get('token')
  @ApiOperation({
    summary: 'Get a short-lived JWT access token (requires active session)',
  })
  @ApiResponse({ status: 200, description: 'Returns JWT token' })
  getToken() {}

  @Post('forget-password')
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Reset email sent if account exists',
  })
  forgotPassword() {}
}
