# cloudinary-promised

This repo contains a promisified version of some functions of the Cloudinary API.
It also does some detection of whether local paths are images or videos to make
the API more intuitive.

```ts
interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;
}
export declare const isVideo: (localAbsolutePath: string) => boolean;
export declare const uploadFile: (id: string, localAbsolutePath: string) => any;
export declare const getMetadata: (id: string, localAbsolutePath: string) => any;
export declare const imageExists: (id: string, config: CloudinaryConfig) => any;
export declare const videoExists: (id: string, config: CloudinaryConfig) => any;
export declare const fileExists: (id: string, localAbsolutePath: string, config: CloudinaryConfig) => Promise<any>;
export declare const uploadOrGetMetadata: (id: string, localAbsolutePath: string, config: CloudinaryConfig) => Promise<any>;
```