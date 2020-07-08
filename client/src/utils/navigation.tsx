/**
 * @desc the thought with this regex bit was to validate the paths,
 * but there isn't an easy way to do that with typescript so I didn't use it
 */
const routeRegex: RegExp = /^\/([A-Za-z])*/;

export interface Pair {
  name: string;
  to: string;
  routes?: Pair[];
}

export interface INavigation {
  brand: Pair;
  links: Pair[];
}

export const navigation: INavigation = {
  brand: { name: 'Supreme Giggle', to: '/' },
  links: [
    { name: 'Meet People', to: '/find' },
    { name: 'Messaging', to: '/messaging' },
    { name: 'Account', to: '/account' },
    {
      name: 'Settings',
      to: '/settings/editProfile',
      routes: [
        { name: 'Edit profile', to: '/editProfile' },
        { name: 'Change password', to: '/changePassword' },
        // { name: 'Manage content', to: '/manageContent' },
        // { name: 'Privacy and Security', to: '/privacySecurity' },
      ],
    },
  ],
};

/**
 * account settings:
 *  -> email: verify email\
 *  -> phone number
 *  -> cookie settings
 *    ** verify a phone number and email to help secure your account**
 *  discovery settings
 *  -> location
 *  -> max distance
 *  -> looking for: interested in
 *  -> age range
 *
 *  -> show my profile
 * notifications
 *  -> email
 *  -> push notifications
 * countact us
 *  -> help and support
 * community
 *  -> community guidelines
 *  -> safety and policy center
 *  -> safety tips
 * legal
 *  -> cookie policy
 *  -> privacy policy
 *  -> terms of service
 * logout
 * delete account
 */
