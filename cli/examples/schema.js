export default {
  schema: (data) => ({
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
        text: `Hello from the CLI!`,
        fontFamily: 'Helvetica',
        textAlign: 'center',
      },
      {
        x: 'center',
        y: 200,
        fontSize: 18,
        color: '#666666',
        text: `Generated by ${data.user.name}`,
        fontFamily: 'Helvetica',
        textAlign: 'center',
      },
    ],
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
  }),
  data: {
    user: {
      name: 'John Smith',
    },
    rows: [
      { number: 1, value: 'One' },
      { number: 2, value: 'Two' },
      { number: 3, value: 'Three' },
    ],
  },
};
