import React, { useState } from 'react';
import { PluginClient, usePlugin, createState, useValue, Layout, DetailSidebar, DataInspector } from 'flipper-plugin';
import { Button, Input, Form, Row, Typography } from 'antd';
import Text from 'antd/lib/typography/Text';
import update from 'immutability-helper';
import { findIndex } from 'lodash'

export function plugin(client: PluginClient<Events, {}>) {
  const data = createState([], { persist: 'data' });
  const selectedId = createState<string | null>(null, {persist: 'selection'});

  client.onMessage('newData', (newData) => {
    data.set(newData);
  });

  client.addMenuEntry({
    action: 'clear',
    handler: async () => {
      data.set({});
    },
  });

  // const method
  const clear = () => client.send('clear', {});

  const refresh = () => client.send('refresh', {});

  const update = () => client.send('update', data);
  const setData = (newData) => data.set(newData);

  const setSelection = (id) => {
    selectedId.set('' + id);
  }

  return { data, selectedId, setSelection, setData, clear, refresh, update };
}

const buttonStyle = {
  margin: 5
}

export function Component() {
  const instance = usePlugin(plugin);
  const data = useValue(instance.data);
  const selectedId = useValue(instance.selectedId);

  const [newItemKey, setNewItemKey] = useState('');
  const [newItemValue, setItemValue] = useState('');
  

  return (
    <>
      <Layout.ScrollContainer>
        <Layout.Container style={{ display: 'flex', flexDirection: 'row', marginBottom: 10, padding: 10 }}>
          <Button onClick={() => instance.refresh()} style={{ ...buttonStyle, marginLeft: 0 }}>Refresh</Button>
          <Button onClick={() => instance.clear()} style={buttonStyle}>Clear</Button>

          <Button onClick={() => instance.update()} style={buttonStyle}>Update</Button>
        </Layout.Container>

        <Layout.Container style={{ display: 'flex', borderWidth: 1, padding: 20, margin: 10 }}>
          <Text style={{ marginBottom: 20, fontSize: 18 }}>Add a new item</Text>
          <Form>
            <Form.Item>
              <Text style={{ marginBottom: 3 }}>Async Storage Key</Text>
              <Input onChange={(e) => { setNewItemKey(e.target.value) }} />
            </Form.Item>
            <Form.Item>
              <Text style={{ marginBottom: 3 }}>Async Storage Value</Text>
              <Input onChange={(e) => { setItemValue(e.target.value) }} />
            </Form.Item>
            <Layout.Container style={{ alignItems: 'flex-end' }}>
              <Button onClick={() => {
                if (newItemKey !== '' && newItemValue !== '') {
                  const newData = update(data, {
                    $push: [{
                      id: newItemKey,
                      content: newItemValue
                    }]
                  })
                  instance.setData(newData)
                }
              }}>
                Add
              </Button>
            </Layout.Container>

          </Form>
        </Layout.Container>

        <Layout.Container style={{ display: 'flex', borderWidth: 1, padding: 20, margin: 10 }}>
          <Text style={{ marginBottom: 20, fontSize: 18 }}>Local storage items</Text>
          {data.map((d) => {

            return (
              <Row style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
                <Layout.Container style={{ display: 'flex', flex: 0.3, alignItems: 'center' }}>
                  <Text style={{ flex: 1 }}>Key: {d.id}</Text>
                </Layout.Container>
                <Layout.Container style={{ display: 'flex', flex: 0.6, alignItems: 'center' }}>
                  <Input
                    value={d.content}
                    name={d.id}
                    onChange={(ev) => {
                      const indexToUpdate = findIndex(data, (item) => item.id === ev.target.name)
                      const newData = update(data, {
                        [indexToUpdate]: {
                          content: {
                            $set: ev.target.value
                          }
                        }
                      })

                      instance.setData(newData)
                    }} />
                </Layout.Container>
                <Layout.Container style={{ display: 'flex', flex: 0.6, alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => {
                      const indexToDelete = findIndex(data, (item) => item.id === d.id)
                      const newData = update(data, {
                        $splice: [[indexToDelete, 1]]
                      })

                      instance.setData(newData)
                    }}
                    style={{ marginBottom: 3 }}
                  >
                    Delete
                  </Button>
                  <Button onClick={() => {
                    const indexToSelection = findIndex(data, (item) => item.id === d.id)
                    instance.setSelection(indexToSelection)
                  }}>
                    Show it
                  </Button>
                </Layout.Container>
              </Row>
            )
          })
          }
        </Layout.Container>
      </Layout.ScrollContainer >
      <DetailSidebar>
        {selectedId && renderSidebar(data[selectedId])}
      </DetailSidebar>
    </>
  );
}

function renderSidebar(row: Row) {
  return (
    <Layout.Container gap pad>
      <Typography.Title level={4}>{row.id}</Typography.Title>
      <DataInspector data={{ ...JSON.parse(row.content) }} expandRoot={true} />
    </Layout.Container>
  );
}