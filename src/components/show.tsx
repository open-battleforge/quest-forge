export default function Show (props: any) {
  const { when, children } = props;
  return (
    <>
      {!!when && children}
    </>
  );
}