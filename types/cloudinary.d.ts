declare module "cloudinary" {
  export const v2: {
    config: (options: {
      cloud_name: string;
      api_key: string;
      api_secret: string;
    }) => void;
    uploader: {
      upload: (
        file: string,
        options?: { [key: string]: any }
      ) => Promise<{ secure_url: string }>;
    };
  };
}
