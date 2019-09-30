import mapboxgl from 'mapbox-gl';
import common from 'govuk-frontend/common';
import SmoothScroll from './smooth-scroll';

function DirectoryMap($module) {
    this.$module = $module || document;
    this.$map = this.$module.querySelector('.js-app-directory-map');
    this.$markers = this.$module.querySelectorAll('.js-app-directory-map-marker');
    this.markers = [];
    this.smoothscroll = new SmoothScroll();
}

DirectoryMap.prototype.initMap = function() {
    mapboxgl.accessToken = '';

    let southWest = new mapboxgl.LngLat(-2.724, 53.008),
        northEast = new mapboxgl.LngLat(-2.009, 53.276),
        bounds = new mapboxgl.LngLatBounds(southWest, northEast);

    this.map = new mapboxgl.Map({
        container: this.$map,
        center: bounds.getCenter(),
        maxBounds: bounds,
        zoom: 8,
        minZoom: 8,
        maxZoom: 18,
        attributionControl: true,
        customAttribution: ['<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'],
        style: {
            version: 8,
            name: 'OSM Liberty',
            metadata: {
                'mapbox:type': 'template'
            },
            sources: {
                openmaptiles: {
                    type: 'vector',
                    tiles: [location.origin + '/assets/map/tiles/{z}/{x}/{y}.pbf'],
                    minzoom: 8,
                    maxzoom: 14
                }
            },
            glyphs: location.origin + '/assets/map/{fontstack}/{range}.pbf',
            layers: [
                {
                    id: 'background',
                    type: 'background',
                    paint: {
                        'background-color': 'rgb(239,239,239)'
                    }
                },
                {
                    id: 'park',
                    type: 'fill',
                    source: 'openmaptiles',
                    'source-layer': 'park',
                    paint: {
                        'fill-color': '#d8e8c8',
                        'fill-opacity': 0.7,
                        'fill-outline-color': 'rgba(95, 208, 100, 1)'
                    }
                },
                {
                    id: 'park_outline',
                    type: 'line',
                    source: 'openmaptiles',
                    'source-layer': 'park',
                    layout: {},
                    paint: {
                        'line-dasharray': [1, 1.5],
                        'line-color': 'rgba(228, 241, 215, 1)',
                        'line-opacity': 1
                    }
                },
                {
                    id: 'landuse_residential',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'landuse',
                    maxzoom: 8,
                    filter: ['==', 'class', 'residential'],
                    layout: {
                        visibility: 'visible'
                    },
                    paint: {
                        'fill-color': {
                            base: 1,
                            stops: [[9, 'hsla(0, 3%, 85%, 0.84)'], [12, 'hsla(35, 57%, 88%, 0.49)']]
                        }
                    }
                },
                {
                    id: 'landcover_wood',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'landcover',
                    filter: ['all', ['==', 'class', 'wood']],
                    paint: {
                        'fill-antialias': false,
                        'fill-color': 'hsla(98, 61%, 72%, 0.7)',
                        'fill-opacity': 0.4
                    }
                },
                {
                    id: 'landcover_grass',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'landcover',
                    filter: ['all', ['==', 'class', 'grass']],
                    paint: {
                        'fill-antialias': false,
                        'fill-color': 'rgba(176, 213, 154, 1)',
                        'fill-opacity': 0.3
                    }
                },
                {
                    id: 'landuse_cemetery',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'landuse',
                    filter: ['==', 'class', 'cemetery'],
                    layout: {
                        visibility: 'visible'
                    },
                    paint: {
                        'fill-color': 'hsl(75, 37%, 81%)'
                    }
                },
                {
                    id: 'landuse_hospital',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'landuse',
                    filter: ['==', 'class', 'hospital'],
                    paint: {
                        'fill-color': '#fde'
                    }
                },
                {
                    id: 'landuse_school',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'landuse',
                    filter: ['==', 'class', 'school'],
                    paint: {
                        'fill-color': 'rgb(236,238,204)'
                    }
                },
                {
                    id: 'waterway_river',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'waterway',
                    filter: ['==', 'class', 'river'],
                    layout: {
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#a0c8f0',
                        'line-width': {
                            base: 1.2,
                            stops: [[11, 0.5], [20, 6]]
                        }
                    }
                },
                {
                    id: 'waterway_other',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'waterway',
                    filter: ['all', ['!=', 'class', 'river']],
                    layout: {
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#a0c8f0',
                        'line-width': {
                            base: 1.3,
                            stops: [[13, 0.5], [20, 6]]
                        }
                    }
                },
                {
                    id: 'water',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'water',
                    paint: {
                        'fill-color': 'rgb(158,189,255)'
                    }
                },
                {
                    id: 'landcover_sand',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'landcover',
                    filter: ['all', ['==', 'class', 'sand']],
                    paint: {
                        'fill-color': 'rgba(247, 239, 195, 1)'
                    }
                },
                {
                    id: 'aeroway_fill',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'aeroway',
                    minzoom: 11,
                    filter: ['==', '$type', 'Polygon'],
                    paint: {
                        'fill-color': 'rgba(229, 228, 224, 1)',
                        'fill-opacity': 0.7
                    }
                },
                {
                    id: 'aeroway_runway',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'aeroway',
                    minzoom: 11,
                    filter: ['all', ['==', '$type', 'LineString'], ['==', 'class', 'runway']],
                    paint: {
                        'line-color': '#f0ede9',
                        'line-width': {
                            base: 1.2,
                            stops: [[11, 3], [20, 16]]
                        }
                    }
                },
                {
                    id: 'aeroway_taxiway',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'aeroway',
                    minzoom: 11,
                    filter: ['all', ['==', '$type', 'LineString'], ['==', 'class', 'taxiway']],
                    paint: {
                        'line-color': '#f0ede9',
                        'line-width': {
                            base: 1.2,
                            stops: [[11, 0.5], [20, 6]]
                        }
                    }
                },
                {
                    id: 'tunnel_motorway_link_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'motorway'], ['==', 'ramp', 1], ['==', 'brunnel', 'tunnel']],
                    layout: {
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-dasharray': [0.5, 0.25],
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[12, 1], [13, 3], [14, 4], [20, 15]]
                        }
                    }
                },
                {
                    id: 'tunnel_service_track_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'service', 'track']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#cfcdca',
                        'line-dasharray': [0.5, 0.25],
                        'line-width': {
                            base: 1.2,
                            stops: [[15, 1], [16, 4], [20, 11]]
                        }
                    }
                },
                {
                    id: 'tunnel_link_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'ramp', '1'], ['==', 'brunnel', 'tunnel']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[12, 1], [13, 3], [14, 4], [20, 15]]
                        }
                    }
                },
                {
                    id: 'tunnel_street_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'street', 'street_limited']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#cfcdca',
                        'line-opacity': {
                            stops: [[12, 0], [12.5, 1]]
                        },
                        'line-width': {
                            base: 1.2,
                            stops: [[12, 0.5], [13, 1], [14, 4], [20, 15]]
                        }
                    }
                },
                {
                    id: 'tunnel_secondary_tertiary_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'secondary', 'tertiary']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[8, 1.5], [20, 17]]
                        }
                    }
                },
                {
                    id: 'tunnel_trunk_primary_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'primary', 'trunk']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0.4], [6, 0.7], [7, 1.75], [20, 22]]
                        }
                    }
                },
                {
                    id: 'tunnel_motorway_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'motorway'], ['==', 'brunnel', 'tunnel']],
                    layout: {
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-dasharray': [0.5, 0.25],
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0.4], [6, 0.7], [7, 1.75], [20, 22]]
                        }
                    }
                },
                {
                    id: 'tunnel_path_pedestrian',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', '$type', 'LineString'], ['==', 'brunnel', 'tunnel'], ['in', 'class', 'path', 'pedestrian']],
                    paint: {
                        'line-color': 'hsl(0, 0%, 100%)',
                        'line-dasharray': [1, 0.75],
                        'line-width': {
                            base: 1.2,
                            stops: [[14, 0.5], [20, 10]]
                        }
                    }
                },
                {
                    id: 'tunnel_motorway_link',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'motorway_link'], ['==', 'ramp', 1], ['==', 'brunnel', 'tunnel']],
                    layout: {
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#fc8',
                        'line-width': {
                            base: 1.2,
                            stops: [[12.5, 0], [13, 1.5], [14, 2.5], [20, 11.5]]
                        }
                    }
                },
                {
                    id: 'tunnel_service_track',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'service', 'track']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fff',
                        'line-width': {
                            base: 1.2,
                            stops: [[15.5, 0], [16, 2], [20, 7.5]]
                        }
                    }
                },
                {
                    id: 'tunnel_link',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'ramp', '1'], ['==', 'brunnel', 'tunnel']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fff4c6',
                        'line-width': {
                            base: 1.2,
                            stops: [[12.5, 0], [13, 1.5], [14, 2.5], [20, 11.5]]
                        }
                    }
                },
                {
                    id: 'tunnel_minor',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'minor']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fff',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[13.5, 0], [14, 2.5], [20, 11.5]]
                        }
                    }
                },
                {
                    id: 'tunnel_secondary_tertiary',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'secondary', 'tertiary']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fff4c6',
                        'line-width': {
                            base: 1.2,
                            stops: [[6.5, 0], [7, 0.5], [20, 10]]
                        }
                    }
                },
                {
                    id: 'tunnel_trunk_primary',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'primary', 'trunk']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fff4c6',
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0], [7, 1], [20, 18]]
                        }
                    }
                },
                {
                    id: 'tunnel_motorway',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'motorway'], ['==', 'brunnel', 'tunnel']],
                    layout: {
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#ffdaa6',
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0], [7, 1], [20, 18]]
                        }
                    }
                },
                {
                    id: 'tunnel_major_rail',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'rail']],
                    paint: {
                        'line-color': '#bbb',
                        'line-width': {
                            base: 1.4,
                            stops: [[14, 0.4], [15, 0.75], [20, 2]]
                        }
                    }
                },
                {
                    id: 'tunnel_major_rail_hatching',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['==', 'class', 'rail']],
                    paint: {
                        'line-color': '#bbb',
                        'line-dasharray': [0.2, 8],
                        'line-width': {
                            base: 1.4,
                            stops: [[14.5, 0], [15, 3], [20, 8]]
                        }
                    }
                },
                {
                    id: 'tunnel_transit_rail',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['in', 'class', 'transit']],
                    paint: {
                        'line-color': '#bbb',
                        'line-width': {
                            base: 1.4,
                            stops: [[14, 0.4], [15, 0.75], [20, 2]]
                        }
                    }
                },
                {
                    id: 'tunnel_transit_rail_hatching',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'tunnel'], ['==', 'class', 'transit']],
                    paint: {
                        'line-color': '#bbb',
                        'line-dasharray': [0.2, 8],
                        'line-width': {
                            base: 1.4,
                            stops: [[14.5, 0], [15, 3], [20, 8]]
                        }
                    }
                },
                {
                    id: 'road_area_pattern',
                    type: 'fill',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', '$type', 'Polygon']],
                    layout: {
                        visibility: 'visible'
                    },
                    paint: {
                        'fill-color': '#e8d5c8',
                        'fill-opacity': 0.7,
                        'fill-outline-color': 'rgba(95, 208, 100, 1)'
                    }
                },
                {
                    id: 'road_motorway_link_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 12,
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'motorway'], ['==', 'ramp', 1]],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[12, 1], [13, 3], [14, 4], [20, 15]]
                        }
                    }
                },
                {
                    id: 'road_service_track_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'service', 'track']],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#cfcdca',
                        'line-width': {
                            base: 1.2,
                            stops: [[15, 1], [16, 4], [20, 11]]
                        }
                    }
                },
                {
                    id: 'road_link_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 13,
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['!in', 'class', 'pedestrian', 'path', 'track', 'service'], ['==', 'ramp', '1']],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[12, 1], [13, 3], [14, 4], [20, 15]]
                        }
                    }
                },
                {
                    id: 'road_minor_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', '$type', 'LineString'], ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'minor'], ['!=', 'ramp', '1']],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#cfcdca',
                        'line-opacity': {
                            stops: [[12, 0], [12.5, 1]]
                        },
                        'line-width': {
                            base: 1.2,
                            stops: [[12, 0.5], [13, 1], [14, 4], [20, 20]]
                        }
                    }
                },
                {
                    id: 'road_secondary_tertiary_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'secondary', 'tertiary'], ['!=', 'ramp', 1]],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[8, 1.5], [20, 17]]
                        }
                    }
                },
                {
                    id: 'road_trunk_primary_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'primary', 'trunk']],
                    layout: {
                        'line-cap': 'butt',
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0.4], [6, 0.7], [7, 1.75], [20, 22]]
                        }
                    }
                },
                {
                    id: 'road_motorway_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 5,
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'motorway'], ['!=', 'ramp', '1']],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0.4], [6, 0.7], [7, 1.75], [20, 22]]
                        }
                    }
                },
                {
                    id: 'road_path_pedestrian',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 14,
                    filter: ['all', ['==', '$type', 'LineString'], ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'path', 'pedestrian']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': 'hsl(0, 0%, 100%)',
                        'line-dasharray': [1, 0.7],
                        'line-width': {
                            base: 1.2,
                            stops: [[14, 1], [20, 10]]
                        }
                    }
                },
                {
                    id: 'road_motorway_link',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 12,
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'motorway'], ['==', 'ramp', 1]],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fc8',
                        'line-width': {
                            base: 1.2,
                            stops: [[12.5, 0], [13, 1.5], [14, 2.5], [20, 11.5]]
                        }
                    }
                },
                {
                    id: 'road_service_track',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'service', 'track']],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fff',
                        'line-width': {
                            base: 1.2,
                            stops: [[15.5, 0], [16, 2], [20, 7.5]]
                        }
                    }
                },
                {
                    id: 'road_link',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 13,
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'ramp', 1], ['!in', 'class', 'pedestrian', 'path', 'track', 'service']],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#fea',
                        'line-width': {
                            base: 1.2,
                            stops: [[12.5, 0], [13, 1.5], [14, 2.5], [20, 11.5]]
                        }
                    }
                },
                {
                    id: 'road_secondary_tertiary',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'secondary', 'tertiary']],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#fea',
                        'line-width': {
                            base: 1.2,
                            stops: [[6.5, 0], [8, 0.5], [20, 13]]
                        }
                    }
                },
                {
                    id: 'road_trunk_primary',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'primary', 'trunk']],
                    layout: {
                        'line-cap': 'butt',
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': '#fea',
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0], [7, 1], [20, 18]]
                        }
                    }
                },
                {
                    id: 'road_motorway',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    minzoom: 5,
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'motorway'], ['!=', 'ramp', 1]],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': {
                            base: 1,
                            stops: [[5, 'hsl(26, 87%, 62%)'], [6, '#fc8']]
                        },
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0], [7, 1], [20, 18]]
                        }
                    }
                },
                {
                    id: 'road_major_rail',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'rail']],
                    paint: {
                        'line-color': '#bbb',
                        'line-width': {
                            base: 1.4,
                            stops: [[14, 0.4], [15, 0.75], [20, 2]]
                        }
                    }
                },
                {
                    id: 'road_major_rail_hatching',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'rail']],
                    paint: {
                        'line-color': '#bbb',
                        'line-dasharray': [0.2, 8],
                        'line-width': {
                            base: 1.4,
                            stops: [[14.5, 0], [15, 3], [20, 8]]
                        }
                    }
                },
                {
                    id: 'road_transit_rail',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'transit']],
                    paint: {
                        'line-color': '#bbb',
                        'line-width': {
                            base: 1.4,
                            stops: [[14, 0.4], [15, 0.75], [20, 2]]
                        }
                    }
                },
                {
                    id: 'road_transit_rail_hatching',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['!in', 'brunnel', 'bridge', 'tunnel'], ['==', 'class', 'transit']],
                    paint: {
                        'line-color': '#bbb',
                        'line-dasharray': [0.2, 8],
                        'line-width': {
                            base: 1.4,
                            stops: [[14.5, 0], [15, 3], [20, 8]]
                        }
                    }
                },
                {
                    id: 'road_minor',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', '$type', 'LineString'], ['!in', 'brunnel', 'bridge', 'tunnel'], ['in', 'class', 'minor']],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fff',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[13.5, 0], [14, 2.5], [20, 18]]
                        }
                    }
                },
                {
                    id: 'bridge_motorway_link_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'motorway_link'], ['==', 'ramp', 1], ['==', 'brunnel', 'bridge']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[12, 1], [13, 3], [14, 4], [20, 15]]
                        }
                    }
                },
                {
                    id: 'bridge_service_track_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'service', 'track']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#cfcdca',
                        'line-width': {
                            base: 1.2,
                            stops: [[15, 1], [16, 4], [20, 11]]
                        }
                    }
                },
                {
                    id: 'bridge_link_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'link'], ['==', 'brunnel', 'bridge']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[12, 1], [13, 3], [14, 4], [20, 15]]
                        }
                    }
                },
                {
                    id: 'bridge_street_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'street', 'street_limited']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': 'hsl(36, 6%, 74%)',
                        'line-opacity': {
                            stops: [[12, 0], [12.5, 1]]
                        },
                        'line-width': {
                            base: 1.2,
                            stops: [[12, 0.5], [13, 1], [14, 4], [20, 25]]
                        }
                    }
                },
                {
                    id: 'bridge_path_pedestrian_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', '$type', 'LineString'], ['==', 'brunnel', 'bridge'], ['in', 'class', 'path', 'pedestrian']],
                    layout: {
                        'line-join': 'miter',
                        visibility: 'visible'
                    },
                    paint: {
                        'line-color': 'hsl(35, 6%, 80%)',
                        'line-dasharray': [1, 0],
                        'line-width': {
                            base: 1.2,
                            stops: [[14, 1.5], [20, 18]]
                        }
                    }
                },
                {
                    id: 'bridge_secondary_tertiary_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'secondary', 'tertiary']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[8, 1.5], [20, 17]]
                        }
                    }
                },
                {
                    id: 'bridge_trunk_primary_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'primary', 'trunk']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0.4], [6, 0.7], [7, 1.75], [20, 22]]
                        }
                    }
                },
                {
                    id: 'bridge_motorway_casing',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'motorway'], ['==', 'brunnel', 'bridge']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#e9ac77',
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0.4], [6, 0.7], [7, 1.75], [20, 22]]
                        }
                    }
                },
                {
                    id: 'bridge_path_pedestrian',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', '$type', 'LineString'], ['==', 'brunnel', 'bridge'], ['in', 'class', 'path', 'pedestrian']],
                    paint: {
                        'line-color': 'hsl(0, 0%, 100%)',
                        'line-dasharray': [1, 0.3],
                        'line-width': {
                            base: 1.2,
                            stops: [[14, 0.5], [20, 10]]
                        }
                    }
                },
                {
                    id: 'bridge_motorway_link',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'motorway_link'], ['==', 'ramp', 1], ['==', 'brunnel', 'bridge']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fc8',
                        'line-width': {
                            base: 1.2,
                            stops: [[12.5, 0], [13, 1.5], [14, 2.5], [20, 11.5]]
                        }
                    }
                },
                {
                    id: 'bridge_service_track',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'service', 'track']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fff',
                        'line-width': {
                            base: 1.2,
                            stops: [[15.5, 0], [16, 2], [20, 7.5]]
                        }
                    }
                },
                {
                    id: 'bridge_link',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'link'], ['==', 'brunnel', 'bridge']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fea',
                        'line-width': {
                            base: 1.2,
                            stops: [[12.5, 0], [13, 1.5], [14, 2.5], [20, 11.5]]
                        }
                    }
                },
                {
                    id: 'bridge_street',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'minor']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fff',
                        'line-opacity': 1,
                        'line-width': {
                            base: 1.2,
                            stops: [[13.5, 0], [14, 2.5], [20, 18]]
                        }
                    }
                },
                {
                    id: 'bridge_secondary_tertiary',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'secondary', 'tertiary']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fea',
                        'line-width': {
                            base: 1.2,
                            stops: [[6.5, 0], [7, 0.5], [20, 10]]
                        }
                    }
                },
                {
                    id: 'bridge_trunk_primary',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'brunnel', 'bridge'], ['in', 'class', 'primary', 'trunk']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fea',
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0], [7, 1], [20, 18]]
                        }
                    }
                },
                {
                    id: 'bridge_motorway',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'motorway'], ['==', 'brunnel', 'bridge']],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#fc8',
                        'line-width': {
                            base: 1.2,
                            stops: [[5, 0], [7, 1], [20, 18]]
                        }
                    }
                },
                {
                    id: 'bridge_major_rail',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'rail'], ['==', 'brunnel', 'bridge']],
                    paint: {
                        'line-color': '#bbb',
                        'line-width': {
                            base: 1.4,
                            stops: [[14, 0.4], [15, 0.75], [20, 2]]
                        }
                    }
                },
                {
                    id: 'bridge_major_rail_hatching',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'rail'], ['==', 'brunnel', 'bridge']],
                    paint: {
                        'line-color': '#bbb',
                        'line-dasharray': [0.2, 8],
                        'line-width': {
                            base: 1.4,
                            stops: [[14.5, 0], [15, 3], [20, 8]]
                        }
                    }
                },
                {
                    id: 'bridge_transit_rail',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'transit'], ['==', 'brunnel', 'bridge']],
                    paint: {
                        'line-color': '#bbb',
                        'line-width': {
                            base: 1.4,
                            stops: [[14, 0.4], [15, 0.75], [20, 2]]
                        }
                    }
                },
                {
                    id: 'bridge_transit_rail_hatching',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation',
                    filter: ['all', ['==', 'class', 'transit'], ['==', 'brunnel', 'bridge']],
                    paint: {
                        'line-color': '#bbb',
                        'line-dasharray': [0.2, 8],
                        'line-width': {
                            base: 1.4,
                            stops: [[14.5, 0], [15, 3], [20, 8]]
                        }
                    }
                },
                {
                    id: 'boundary_3',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'boundary',
                    filter: ['all', ['in', 'admin_level', 3, 4]],
                    layout: {
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': '#9e9cab',
                        'line-dasharray': [5, 1],
                        'line-width': {
                            base: 1,
                            stops: [[4, 0.4], [5, 1], [12, 1.8]]
                        }
                    }
                },
                {
                    id: 'boundary_2',
                    type: 'line',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'boundary',
                    filter: ['all', ['==', 'admin_level', 2]],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round'
                    },
                    paint: {
                        'line-color': 'hsl(248, 1%, 41%)',
                        'line-opacity': {
                            base: 1,
                            stops: [[0, 0.4], [4, 1]]
                        },
                        'line-width': {
                            base: 1,
                            stops: [[3, 1], [5, 1.2], [12, 3]]
                        }
                    }
                },
                {
                    id: 'water_name_line',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'water_name',
                    minzoom: 0,
                    filter: ['all', ['==', '$type', 'LineString']],
                    layout: {
                        'text-field': '{name}',
                        'text-font': ['Roboto Regular'],
                        'text-max-width': 5,
                        'text-size': 12,
                        'symbol-placement': 'line'
                    },
                    paint: {
                        'text-color': '#5d60be',
                        'text-halo-color': 'rgba(255,255,255,0.7)',
                        'text-halo-width': 1
                    }
                },
                {
                    id: 'water_name_point',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'water_name',
                    minzoom: 0,
                    filter: ['==', '$type', 'Point'],
                    layout: {
                        'text-field': '{name}',
                        'text-font': ['Roboto Regular'],
                        'text-max-width': 5,
                        'text-size': 12
                    },
                    paint: {
                        'text-color': '#5d60be',
                        'text-halo-color': 'rgba(255,255,255,0.7)',
                        'text-halo-width': 1
                    }
                },
                {
                    id: 'road_label',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation_name',
                    filter: ['all'],
                    layout: {
                        'symbol-placement': 'line',
                        'text-anchor': 'center',
                        'text-field': '{name}',
                        'text-font': ['Roboto Regular'],
                        'text-offset': [0, 0.15],
                        'text-size': {
                            base: 1,
                            stops: [[13, 12], [14, 13]]
                        }
                    },
                    paint: {
                        'text-color': '#765',
                        'text-halo-blur': 0.5,
                        'text-halo-width': 1
                    }
                },
                {
                    id: 'road_shield',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'transportation_name',
                    minzoom: 7,
                    filter: ['all', ['<=', 'ref_length', 6]],
                    layout: {
                        'icon-image': 'default_{ref_length}',
                        'icon-rotation-alignment': 'viewport',
                        'symbol-placement': {
                            base: 1,
                            stops: [[10, 'point'], [11, 'line']]
                        },
                        'symbol-spacing': 500,
                        'text-field': '{ref}',
                        'text-font': ['Roboto Regular'],
                        'text-offset': [0, 0.1],
                        'text-rotation-alignment': 'viewport',
                        'text-size': 10,
                        'icon-size': 0.8
                    },
                    paint: {}
                },
                {
                    id: 'place_other',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    filter: ['all', ['in', 'class', 'hamlet', 'island', 'islet', 'neighbourhood', 'suburb']],
                    layout: {
                        'text-field': '{name_en}',
                        'text-font': ['Roboto Condensed Italic'],
                        'text-letter-spacing': 0.1,
                        'text-max-width': 9,
                        'text-size': {
                            base: 1.2,
                            stops: [[12, 10], [15, 14]]
                        },
                        'text-transform': 'uppercase'
                    },
                    paint: {
                        'text-color': '#633',
                        'text-halo-color': 'rgba(255,255,255,0.8)',
                        'text-halo-width': 1.2
                    }
                },
                {
                    id: 'place_village',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    filter: ['all', ['==', 'class', 'village']],
                    layout: {
                        'text-field': '{name_en}',
                        'text-font': ['Roboto Regular'],
                        'text-max-width': 8,
                        'text-size': {
                            base: 1.2,
                            stops: [[10, 12], [15, 22]]
                        }
                    },
                    paint: {
                        'text-color': '#333',
                        'text-halo-color': 'rgba(255,255,255,0.8)',
                        'text-halo-width': 1.2
                    }
                },
                {
                    id: 'place_town',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    filter: ['all', ['==', 'class', 'town']],
                    layout: {
                        'icon-image': {
                            base: 1,
                            stops: [[0, 'dot_9'], [8, '']]
                        },
                        'text-anchor': 'bottom',
                        'text-field': '{name_en}',
                        'text-font': ['Roboto Regular'],
                        'text-max-width': 8,
                        'text-offset': [0, 0],
                        'text-size': {
                            base: 1.2,
                            stops: [[7, 12], [11, 16]]
                        }
                    },
                    paint: {
                        'text-color': '#333',
                        'text-halo-color': 'rgba(255,255,255,0.8)',
                        'text-halo-width': 1.2
                    }
                },
                {
                    id: 'place_city',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    minzoom: 5,
                    filter: ['all', ['==', 'class', 'city']],
                    layout: {
                        'icon-image': {
                            base: 1,
                            stops: [[0, 'dot_9'], [8, '']]
                        },
                        'text-anchor': 'bottom',
                        'text-field': '{name_en}',
                        'text-font': ['Roboto Medium'],
                        'text-max-width': 8,
                        'text-offset': [0, 0],
                        'text-size': {
                            base: 1.2,
                            stops: [[7, 14], [11, 24]]
                        },
                        'icon-allow-overlap': true,
                        'icon-optional': false
                    },
                    paint: {
                        'text-color': '#333',
                        'text-halo-color': 'rgba(255,255,255,0.8)',
                        'text-halo-width': 1.2
                    }
                },
                {
                    id: 'state',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    maxzoom: 6,
                    filter: ['all', ['==', 'class', 'state']],
                    layout: {
                        'text-field': '{name_en}',
                        'text-font': ['Roboto Condensed Italic'],
                        'text-size': {
                            stops: [[4, 11], [6, 15]]
                        },
                        'text-transform': 'uppercase',
                        visibility: 'visible'
                    },
                    paint: {
                        'text-color': '#633',
                        'text-halo-color': 'rgba(255,255,255,0.7)',
                        'text-halo-width': 1
                    }
                },
                {
                    id: 'country_3',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    filter: ['all', ['>=', 'rank', 3], ['==', 'class', 'country']],
                    layout: {
                        'text-field': '{name_en}',
                        'text-font': ['Roboto Condensed Italic'],
                        'text-max-width': 6.25,
                        'text-size': {
                            stops: [[3, 11], [7, 17]]
                        },
                        'text-transform': 'none'
                    },
                    paint: {
                        'text-color': '#334',
                        'text-halo-blur': 1,
                        'text-halo-color': 'rgba(255,255,255,0.8)',
                        'text-halo-width': 1
                    }
                },
                {
                    id: 'country_2',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    filter: ['all', ['==', 'rank', 2], ['==', 'class', 'country']],
                    layout: {
                        'text-field': '{name_en}',
                        'text-font': ['Roboto Condensed Italic'],
                        'text-max-width': 6.25,
                        'text-size': {
                            stops: [[2, 11], [5, 17]]
                        },
                        'text-transform': 'none'
                    },
                    paint: {
                        'text-color': '#334',
                        'text-halo-blur': 1,
                        'text-halo-color': 'rgba(255,255,255,0.8)',
                        'text-halo-width': 1
                    }
                },
                {
                    id: 'country_1',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    filter: ['all', ['==', 'rank', 1], ['==', 'class', 'country']],
                    layout: {
                        'text-field': '{name_en}',
                        'text-font': ['Roboto Condensed Italic'],
                        'text-max-width': 6.25,
                        'text-size': {
                            stops: [[1, 11], [4, 17]]
                        },
                        'text-transform': 'none'
                    },
                    paint: {
                        'text-color': '#334',
                        'text-halo-blur': 1,
                        'text-halo-color': 'rgba(255,255,255,0.8)',
                        'text-halo-width': 1
                    }
                },
                {
                    id: 'continent',
                    type: 'symbol',
                    metadata: {},
                    source: 'openmaptiles',
                    'source-layer': 'place',
                    maxzoom: 1,
                    filter: ['all', ['==', 'class', 'continent']],
                    layout: {
                        'text-field': '{name_en}',
                        'text-font': ['Roboto Condensed Italic'],
                        'text-size': 13,
                        'text-transform': 'uppercase',
                        'text-justify': 'center'
                    },
                    paint: {
                        'text-color': '#633',
                        'text-halo-color': 'rgba(255,255,255,0.7)',
                        'text-halo-width': 1
                    }
                }
            ],
            id: 'osm-liberty'
        }
    });

    // disable rotation of the map
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

    this.map.on('wheel', function(e) {
        // only zoom when Ctrl/Command key is pressed
        if (!e.originalEvent.metaKey && !e.originalEvent.ctrlKey) {
            e.target.scrollZoom.disable();
        } else {
            e.target.scrollZoom.enable();
        }
    });

    this.map.on('touchstart', function(e) {
        // only pan or zoom when two fingers touch the screen
        if (e.originalEvent.touches.length < 2) {
            e.target.dragPan.disable();
            e.target.scrollZoom.disable();
        } else {
            e.target.dragPan.enable();
            e.target.scrollZoom.enable();
        }
    });

    // add markers
    let markers = this.markers;
    let markerBounds = new mapboxgl.LngLatBounds();

    let map = this.map;

    common.nodeListForEach(this.$markers, function($marker) {
        if (!$marker.dataset.lng || !$marker.dataset.lat) {
            return;
        }

        let $el = document.createElement('div');
        $el.className = 'map__marker';

        let marker = new mapboxgl.Marker($el, { anchor: 'bottom' });

        marker.id = $marker.id;

        marker.setLngLat(new mapboxgl.LngLat($marker.dataset.lng, $marker.dataset.lat));

        let popup = new mapboxgl.Popup({ offset: 45 }).setHTML(
            '<h4 class="govuk-heading-m govuk-!-font-weight-bold govuk-!-color-purple">' +
                $marker.dataset.displayName +
                '</h4><button type="button" class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0 js-app-directory-view-details" data-module="govuk-button" data-id="' +
                $marker.id +
                '">View Details</button>'
        );

        marker.setPopup(popup);

        marker.addTo(map);

        markers.push(marker);
        markerBounds = markerBounds.extend(marker.getLngLat());
    });

    this.map.fitBounds(markerBounds, { padding: 75 });
};

DirectoryMap.prototype.initMarkerClicks = function() {
    let self = this;
    let $viewMapButtons = this.$module.querySelectorAll('.js-app-directory-view-map');

    this.$map.addEventListener('click', function(e) {
        if (!e.target.classList.contains('js-app-directory-view-details')) {
            // only deal with button clicks
            return;
        }

        let $button = e.target;

        self.smoothscroll.scrollToElement('#' + $button.dataset.id);
    });

    let markers = this.markers;
    let map = this.map;

    common.nodeListForEach($viewMapButtons, function($viewMapButton) {
        $viewMapButton.addEventListener('click', function() {
            let $button = this;
            let markerId = $button.closest('.js-app-directory-map-marker').id;

            markers.forEach(function(marker) {
                let popup = marker.getPopup();

                if (marker.id === markerId) {
                    // open popup & center it
                    popup.addTo(map);

                    map.setCenter(marker.getLngLat());
                } else {
                    // no match, close marker if open
                    if (popup.isOpen()) {
                        popup.remove();
                    }
                }
            });

            self.smoothscroll.scrollToElement('#' + map.getContainer().id);
        });
    });
};

DirectoryMap.prototype.init = function() {
    // We detect features we need to use only available in IE9+ https://caniuse.com/#feat=addeventlistener
    // http://responsivenews.co.uk/post/18948466399/cutting-the-mustard
    var featuresNeeded = 'querySelector' in document && 'addEventListener' in window;

    if (!featuresNeeded) {
        return;
    }

    if (!this.$map) {
        return;
    }

    this.smoothscroll.init();

    this.initMap();
    this.initMarkerClicks();
};

export default DirectoryMap;
