declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: IntrinsicAttributes &
    IntrinsicClassAttributes<Image> &
    Readonly<ImageProps>;
  export default content;
}
