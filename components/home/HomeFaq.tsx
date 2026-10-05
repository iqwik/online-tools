import {FAQ} from '../shared/FAQ'

export async function HomeFaq() {
  const items = [
    {q: 'faq.q1', a: 'faq.a1'},
    {q: 'faq.q2', a: 'faq.a2'},
    {q: 'faq.q3', a: 'faq.a3'},
  ]

  return (
    <section className="page w-full">
      <FAQ items={items} namespace="home" />
    </section>
  )
}
