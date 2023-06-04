import type { V2_MetaFunction } from '@vercel/remix';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Verd' }
  ];
};

export default function Index() {
  return (
    <div>
      home
    </div>
  );
}
