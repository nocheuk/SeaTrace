import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import Supercluster from 'supercluster';
import { useTheme } from '@/theme';
import type { ReportPublic } from '@/types/database';

type Props = {
  reports: ReportPublic[];
  region: Region;
  onRegionChangeComplete?: (region: Region) => void;
  onMarkerPress?: (report: ReportPublic) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  selectedReportId?: string | null;
};

type ClusterFeature = Supercluster.PointFeature<{ report: ReportPublic }>;

export function CoastalMap({
  reports,
  region,
  onRegionChangeComplete,
  onMarkerPress,
  userLocation,
  selectedReportId,
}: Props) {
  const { theme } = useTheme();

  const index = useMemo(() => {
    const sc = new Supercluster<{ report: ReportPublic }>({ radius: 50, maxZoom: 16 });
    const points: ClusterFeature[] = reports.map((report) => ({
      type: 'Feature',
      properties: { report },
      geometry: {
        type: 'Point',
        coordinates: [report.display_longitude, report.display_latitude],
      },
    }));
    sc.load(points);
    return sc;
  }, [reports]);

  const clusters = useMemo(() => {
    const bbox: [number, number, number, number] = [
      region.longitude - region.longitudeDelta / 2,
      region.latitude - region.latitudeDelta / 2,
      region.longitude + region.longitudeDelta / 2,
      region.latitude + region.latitudeDelta / 2,
    ];
    const zoom = Math.round(Math.log2(360 / region.longitudeDelta));
    return index.getClusters(bbox, zoom);
  }, [index, region]);

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      region={region}
      onRegionChangeComplete={onRegionChangeComplete}
      showsUserLocation={!!userLocation}
      showsCompass
      showsScale
    >
      {clusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const isCluster = 'cluster' in cluster.properties && cluster.properties.cluster;

        if (isCluster) {
          const count = (cluster.properties as { point_count: number }).point_count;
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              coordinate={{ latitude: lat, longitude: lng }}
            >
              <View style={[styles.cluster, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.clusterText}>{count}</Text>
              </View>
            </Marker>
          );
        }

        const report = (cluster.properties as { report: ReportPublic }).report;
        const selected = report.id === selectedReportId;

        return (
          <Marker
            key={report.id}
            coordinate={{ latitude: lat, longitude: lng }}
            pinColor={selected ? theme.colors.accent : theme.colors.primaryDark}
            onPress={() => onMarkerPress?.(report)}
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  cluster: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
