import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GoogleMap,
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';
import { MissionaryService, Missionary } from '../services/missionary.service';
import { PermissionDirective } from '../directives/permission.directive';

interface Marker {
  position: google.maps.LatLngLiteral;
  title: string;
  info: string;
  id: string;
  options: google.maps.MarkerOptions;
}

@Component({
  selector: 'app-missionaries-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GoogleMap,
    MapMarker,
    MapInfoWindow,
    PermissionDirective,
  ],
  templateUrl: './missionaries-map.component.html',
  styleUrls: ['./missionaries-map.component.scss'],
})
export class MissionariesMapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  infoWindow!: google.maps.InfoWindow;

  updating = false;
  updateMessage = '';
  // mapa
  center: google.maps.LatLngLiteral = { lat: -25.4278, lng: -49.2733 }; // centro inicial (Curitiba)
  zoom = 6;

  // controles
  addressSearch = '';
  loading = false;
  message = '';

  // marcadores
  markers: Marker[] = [];

  // seleção info
  selectedMarker?: {
    position: google.maps.LatLngLiteral;
    title: string;
    id: string;
    info: string;
  };

  constructor(private missionaryService: MissionaryService) {}

  ngOnInit(): void {
    this.loadAllMissionaries();
  }

  loadAllMissionaries(): void {
    this.message = '';
    this.loading = true;
    this.missionaryService.getAllWithLocation().subscribe({
      next: (list) => {
        this.markers = list
          .filter(
            (m) =>
              m.address?.location?.coordinates &&
              m.address.location.coordinates.length === 2
          )
          .map((m) => {
            if (m.address?.location?.coordinates) {
              const [lon, lat] = m.address.location.coordinates;
              return {
                position: { lat, lng: lon },
                title: m.name,
                id: m._id,
                info: `${m.name}<br/>${m.address.street}, ${m.address.city} - ${m.address.state}`,
                options: {},
              };
            }
            return undefined;
          })
          .filter(
            (marker): marker is NonNullable<typeof marker> =>
              marker !== undefined
          );

        if (this.markers.length) {
          // centraliza no primeiro
          this.center = this.markers[0].position;
          this.zoom = 10;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.message = 'Erro ao carregar missionários.';
        this.loading = false;
      },
    });
  }

  // clicar no marcador
  openInfo(event: any, markerData: any) {
    this.selectedMarker = markerData;
    console.log('Marker clicked:', markerData);

    // Se não tiver criado o InfoWindow, cria
    if (!this.infoWindow) {
      this.infoWindow = new google.maps.InfoWindow();
    }

    // Seta o conteúdo e abre
    this.infoWindow.setContent(markerData.info);
    this.infoWindow.setPosition(markerData.position);
    this.infoWindow.open(this.map.googleMap); // 'map' é a referência ao <google-map>
  }

  // busca por endereço e usa endpoint backend /location/near se existir
  searchAndCenter() {
    if (!this.addressSearch?.trim()) {
      this.message = 'Digite um endereço para buscar.';
      return;
    }

    this.loading = true;
    this.message = 'Buscando missionários próximos...';

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: this.addressSearch }, (results, status) => {
      if (results && status === 'OK' && results.length > 0) {
        const location = results[0].geometry.location;
        const centerLat = location.lat();
        const centerLng = location.lng();

        // Centraliza o mapa no endereço pesquisado
        this.center = { lat: centerLat, lng: centerLng };
        this.zoom = 13;

        // Busca missionários próximos via backend
        this.missionaryService
          .findNearbyByAddress(this.addressSearch, 10)
          .subscribe({
            next: (res) => {
              // 🧭 Agora o retorno é { origin, count, users }
              const nearbyUsers = Array.isArray(res?.users) ? res.users : [];

              // Cria os marcadores dos missionários
              this.markers = nearbyUsers.map((m: any) => {
                const coords = m.address?.location?.coordinates;
                if (!coords || coords.length < 2) return null;

                const lng = parseFloat(coords[0]); // longitude
                const lat = parseFloat(coords[1]); // latitude
                if (isNaN(lat) || isNaN(lng)) return null;

                return {
                  position: { lat, lng },
                  title: m.name,
                  info: `<strong>${m.name}</strong><br>${
                    m.address?.city ?? ''
                  }`,
                  id: m._id,
                };
              });

              // Adiciona marcador do endereço pesquisado
              this.markers.unshift({
                position: { lat: centerLat, lng: centerLng },
                title: 'Endereço pesquisado',
                info: `<strong>${this.addressSearch}</strong>`,
                id: 'searched',
                options: {
                  icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // marcador azul
                    scaledSize: new google.maps.Size(40, 40),
                  },
                },
              });

              if (res?.count > 0) {
                this.message = `Encontrados ${res.count} missionários próximos.`;
              } else {
                this.message =
                  'Nenhum missionário encontrado próximo ao endereço informado.';
              }

              this.loading = false;
            },
            error: (err) => {
              console.error('Erro na busca:', err);
              this.message = 'Erro ao buscar missionários próximos.';
              this.loading = false;
            },
          });
      } else {
        this.message = 'Endereço não encontrado.';
        this.loading = false;
      }
    });
  }

  // somente centralizar no input (se quiser usar geocode no front)
  centerOn(lat: number, lng: number) {
    this.center = { lat, lng };
    this.zoom = 14;
  }

  updateCoordinatesManually() {
    this.updating = true;
    this.updateMessage = 'Atualizando coordenadas...';

    this.missionaryService.updateCoordinates().subscribe({
      next: (res) => {
        this.updateMessage = res.message;
        this.updating = false;
      },
      error: (err) => {
        console.error(err);
        this.updateMessage = 'Erro ao atualizar coordenadas.';
        this.updating = false;
      },
    });
  }
}
