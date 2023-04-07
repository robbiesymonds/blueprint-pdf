import { schema } from '../..';

export const data = {
  user: {
    name: 'John Smith',
  },
  rows: [
    { number: 1, value: 'One' },
    { number: 2, value: 'Two' },
    { number: 3, value: 'Three' },
  ],
};

export default schema((data) => ({
  shapes: [
    {
      type: 'box',
      x: 'center',
      y: 20,
      height: 100,
      width: 100,
      borderRadius: 10,
      backgroundColor: '#3996e6',
      borderWidth: 1,
      borderColor: '#1370ba',
    },
  ],
  text: [
    {
      x: 'center',
      y: 160,
      fontSize: 24,
      color: '#333333',
      text: `Hello ${data.user.name}!`,
      fontFamily: 'Cal Sans',
      textAlign: 'center',
    },
  ],
  //   images: [
  //     {
  //       x: 'center',
  //       y: 30,
  //       width: 80,
  //       height: 80,
  //       src: TEST_IMAGE,
  //     },
  //   ],
  loops: [
    {
      data: data.rows,
      template: (row, i) => ({
        text: [
          {
            x: 30,
            y: 290 + i * 30,
            text: `${row.number}. This item says: ${row.value}`,
          },
        ],
        shapes: [
          {
            type: 'box',
            width: '90%',
            height: 1,
            x: 'center',
            y: 300 + i * 30,
            backgroundColor: '#111111',
          },
        ],
      }),
    },
  ],
  //   options: {
  //     fonts: [
  //       {
  //         family: 'Cal Sans',
  //         src: FONT_TTF,
  //       },
  //     ],
  //   },
}));
