//  CONSTANTS:VISIBILITY
//  ====================

//  Valid values for `VISIBILITY` are represented via binary flags:

//  - __`00000001` :__ Visible to followers
//  - __`00000010` :__ Visible to non-followers
//  - __`00000100` :__ Visible on a profile
//  - __`00001000` :__ Visible on the public timelines
//  - __`00010000` :__ Boostable
//  - __`00100000` :__ Able to be federated

//  Most of these combinations are not presently available via the
//  Mastodon API. Those that are are defined below.
export const LOCAL_DIRECT   = 0b00000000;
export const FOLLOWERS      = 0b00000001;  //  Used with comparisons
export const NON_FOLLOWERS  = 0b00000010;  //  Used with comparisons
export const PROFILE        = 0b00000100;  //  Used with comparisons
export const LOCAL_PRIVATE  = 0b00000101;
export const TIMELINE       = 0b00001000;  //  Used with comparisons
export const BOOSTABLE      = 0b00010000;  //  Used with comparisons
export const LOCAL_UNLISTED = 0b00010111;
export const LOCAL_PUBLIC   = 0b00011111;
export const FEDERATED      = 0b00100000;  //  Alias; used with comparisons
export const DIRECT         = 0b00100000;
export const PRIVATE        = 0b00100101;
export const UNLISTED       = 0b00110111;
export const PUBLIC         = 0b00111111;
