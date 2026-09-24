import { redirect } from 'next/navigation';

export default function Home() {
  // Automatically send users hitting the root URL to the products page.
  redirect('/products');
}