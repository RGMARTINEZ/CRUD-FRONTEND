import { formatDate } from '@angular/common';


export class modeloUsuario {
  id: number;
  avatar: string;
  nombre: string;
  apellido: string;
  correo: string;
  genero: string;
  nacimiento: string;
  celular: string;
  direccion: string;
  pais: string;

  constructor(model: modeloUsuario) {
    {
      this.id = model.id || this.getRandomID();
      this.avatar = model.avatar || 'assets/images/user1.jpg';
      this.nombre = model.nombre || '';
      this.apellido = model.apellido || '';
      this.correo = model.correo || '';
      this.genero = model.genero || 'male';
      this.nacimiento = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.celular = model.celular || '';
      this.direccion = model.direccion || '';
      this.pais = model.pais || '';
    }
  }

  getRandomID(): number {
    return Math.floor(Math.random() * 1000);
  }
}



export function conversionApiModeloUsuario(data: any): modeloUsuario[] {
  return data.map((user: any) => {
    return {
      id: user.id?.value || '', 
      avatar: user.picture?.thumbnail || 'assets/images/user1.jpg',
      nombre: user.name?.first || '',
      apellido: user.name?.last || '',
      correo: user.email || '',
      genero: user.gender || '',
      nacimiento: user.dob?.date || '',
      direccion: user.location?.street.name || '',
      celular: user.phone || '',
      pais: user.location?.country || ''
    };
  });
}
