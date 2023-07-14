import { http } from "./config";

export default {

  listStudents:() => {
    return http.get('list')
  },

  registerStudent:(student) => {
    return http.post('register',student)
  },

  update(id, student) {
    return http.put(`/edit/${id}`, student);
  },
  delete(id) {
    return http.delete(`/delete/${id}`);
  },
}