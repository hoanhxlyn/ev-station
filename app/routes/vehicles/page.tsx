import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Modal,
  NumberInput,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { IconCar, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useFetcher } from 'react-router'
import { useState } from 'react'
import {
  addVehicleIntent,
  editVehicleIntent,
  type AddVehicleValues,
  type EditVehicleValues,
} from '~/schemas/vehicle'
import styles from './page.module.css'
import type { Route } from './+types/page'

export { vehiclesLoader as loader } from './loader'
export { vehiclesAction as action } from './actions'

export function meta() {
  return [
    { title: 'EV Station | Vehicles' },
    {
      name: 'description',
      content: 'Manage your EV Station vehicles.',
    },
  ]
}

interface Vehicle {
  id: string
  licensePlate: string
  brand: string
  model: string
  batteryCapacity: number
}

export default function VehiclesPage({ loaderData }: Route.ComponentProps) {
  const { vehicles } = loaderData
  const fetcher = useFetcher()
  const isLoading = fetcher.state !== 'idle'

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null)
  const [deleteVehicleData, setDeleteVehicleData] = useState<Vehicle | null>(
    null,
  )

  const addForm = useForm<AddVehicleValues>({
    mode: 'uncontrolled',
    initialValues: {
      intent: 'add',
      licensePlate: '',
      brand: '',
      model: '',
      batteryCapacity: 50,
    },
    validate: zodResolver(addVehicleIntent),
  })

  const editForm = useForm<EditVehicleValues>({
    mode: 'uncontrolled',
    initialValues: {
      intent: 'edit',
      vehicleId: '',
      licensePlate: '',
      brand: '',
      model: '',
      batteryCapacity: 50,
    },
    validate: zodResolver(editVehicleIntent),
  })

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validation = addForm.validate()
    if (validation.hasErrors) return
    fetcher.submit(event.currentTarget)
    setAddModalOpen(false)
    addForm.reset()
  }

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validation = editForm.validate()
    if (validation.hasErrors) return
    fetcher.submit(event.currentTarget)
    setEditVehicle(null)
  }

  const handleDelete = () => {
    if (!deleteVehicleData) return
    fetcher.submit(
      { intent: 'delete', vehicleId: deleteVehicleData.id },
      { method: 'post' },
    )
    setDeleteVehicleData(null)
  }

  const openEditModal = (v: Vehicle) => {
    editForm.setValues({
      intent: 'edit',
      vehicleId: v.id,
      licensePlate: v.licensePlate,
      brand: v.brand,
      model: v.model,
      batteryCapacity: v.batteryCapacity,
    })
    setEditVehicle(v)
  }

  return (
    <Box className={styles.pageShell}>
      <Container size="xl" py="xl">
        <Group justify="space-between" align="center" mb="xl">
          <Group gap="sm">
            <ThemeIcon
              size={44}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'teal.5', to: 'cyan.5', deg: 135 }}
            >
              <IconCar size={22} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={800} lh={1.1} size="lg">
                Vehicles
              </Text>
              <Text size="sm" c="dimmed">
                Manage your vehicles
              </Text>
            </Stack>
          </Group>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => setAddModalOpen(true)}
          >
            Add Vehicle
          </Button>
        </Group>

        <Card radius="xl" p="lg" withBorder shadow="sm">
          <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>License Plate</Table.Th>
                  <Table.Th>Brand</Table.Th>
                  <Table.Th>Model</Table.Th>
                  <Table.Th>Battery</Table.Th>
                  <Table.Th ta="right">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {vehicles.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Text c="dimmed" ta="center" py="md">
                        No vehicles yet. Add your first vehicle to get started.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  vehicles.map((v) => (
                    <Table.Tr key={v.id}>
                      <Table.Td>
                        <Badge variant="light" color="teal" radius="xl">
                          {v.licensePlate}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{v.brand}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{v.model}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{v.batteryCapacity} kWh</Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Group gap="xs" justify="flex-end">
                          <Button
                            variant="subtle"
                            size="xs"
                            leftSection={<IconEdit size={14} />}
                            onClick={() => openEditModal(v)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="subtle"
                            color="red"
                            size="xs"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => setDeleteVehicleData(v)}
                          >
                            Delete
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Container>

      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Vehicle"
        radius="lg"
      >
        <fetcher.Form method="post" autoComplete="off" onSubmit={handleAdd}>
          <input type="hidden" name="intent" value="add" />
          <Stack gap="md">
            <TextInput
              label="License Plate"
              placeholder="Enter license plate"
              withAsterisk
              name="licensePlate"
              key={addForm.key('licensePlate')}
              {...addForm.getInputProps('licensePlate')}
            />
            <TextInput
              label="Brand"
              placeholder="Enter brand"
              withAsterisk
              name="brand"
              key={addForm.key('brand')}
              {...addForm.getInputProps('brand')}
            />
            <TextInput
              label="Model"
              placeholder="Enter model"
              withAsterisk
              name="model"
              key={addForm.key('model')}
              {...addForm.getInputProps('model')}
            />
            <NumberInput
              label="Battery Capacity (kWh)"
              placeholder="Enter battery capacity"
              withAsterisk
              min={10}
              max={500}
              name="batteryCapacity"
              key={addForm.key('batteryCapacity')}
              {...addForm.getInputProps('batteryCapacity')}
            />
            <Button type="submit" fullWidth loading={isLoading}>
              Add Vehicle
            </Button>
          </Stack>
        </fetcher.Form>
      </Modal>

      <Modal
        opened={!!editVehicle}
        onClose={() => setEditVehicle(null)}
        title="Edit Vehicle"
        radius="lg"
      >
        <fetcher.Form method="post" autoComplete="off" onSubmit={handleEdit}>
          <input type="hidden" name="intent" value="edit" />
          <input
            type="hidden"
            name="vehicleId"
            value={editForm.values.vehicleId}
          />
          <Stack gap="md">
            <TextInput
              label="License Plate"
              placeholder="Enter license plate"
              withAsterisk
              name="licensePlate"
              key={editForm.key('licensePlate')}
              {...editForm.getInputProps('licensePlate')}
            />
            <TextInput
              label="Brand"
              placeholder="Enter brand"
              withAsterisk
              name="brand"
              key={editForm.key('brand')}
              {...editForm.getInputProps('brand')}
            />
            <TextInput
              label="Model"
              placeholder="Enter model"
              withAsterisk
              name="model"
              key={editForm.key('model')}
              {...editForm.getInputProps('model')}
            />
            <NumberInput
              label="Battery Capacity (kWh)"
              placeholder="Enter battery capacity"
              withAsterisk
              min={10}
              max={500}
              name="batteryCapacity"
              key={editForm.key('batteryCapacity')}
              {...editForm.getInputProps('batteryCapacity')}
            />
            <Button type="submit" fullWidth loading={isLoading}>
              Save Changes
            </Button>
          </Stack>
        </fetcher.Form>
      </Modal>

      <Modal
        opened={!!deleteVehicleData}
        onClose={() => setDeleteVehicleData(null)}
        title="Delete Vehicle"
        radius="lg"
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete {deleteVehicleData?.brand}{' '}
            {deleteVehicleData?.model} ({deleteVehicleData?.licensePlate})?
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              onClick={() => setDeleteVehicleData(null)}
            >
              Cancel
            </Button>
            <Button color="red" onClick={handleDelete} loading={isLoading}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
