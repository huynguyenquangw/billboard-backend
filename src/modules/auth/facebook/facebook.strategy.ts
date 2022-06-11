// import { Injectable } from '@nestjs/common';
// import { use } from 'passport';
// import { UserService } from 'src/api/users/user.service';

// @Injectable()
// export class FacebookStrategy {
//   constructor(
//     private readonly userService: UserService,
//   ) {
//     this.init();
//   }
//   init() {
//     use(
//       new FacebookTokenStrategy(
//         {
//           clientID: <YOUR_APP_CLIENT_ID>,
//           clientSecret: <YOUR_APP_CLIENT_SECRET>,
//           fbGraphVersion: 'v3.0',
//         },
//         async (
//           accessToken: string,
//           refreshToken: string,
//           profile: any,
//           done: any,
//         ) => {
//           const user = await this.userService.findOrCreate(
//             profile,
//           );
//           return done(null, user);
//         },
//       ),
//     );
//   }
// }
