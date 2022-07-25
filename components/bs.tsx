interface Props {
  text: string;
}

export default function Bs({ text }: Props) {
  console.log("Hello I'm bs");
  return <h1>Hello~!! {text}</h1>;
}
